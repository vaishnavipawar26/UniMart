import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import PrintItem from "../models/PrintI.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, cartItems, totalAmount } = req.body;

    //  Validations
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (!deliveryAddress || !deliveryAddress.text)
      return res.status(400).json({ message: "Delivery address is empty" });

    // Group items by shop
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop || item.shopId;
      if (!shopId) return console.warn("Missing shop ID for item:", item);
      if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
      groupItemsByShop[shopId].push(item);
    });

    //  Create separate shop orders
    const shopOrder = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) throw new Error(`Shop not found for ID: ${shopId}`);

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        // Return the shop order object
        return {
          shop: shop._id,
          owner: shop.owner?._id || null,
          subtotal,
          shopOrderItems: items.map((i) => {
            if (i.shopType === "print") {
              return {
                type: i.type,
                shopId: i.shopId,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                printDetails: i.printDetails, // include pdfFile, pages, copies, etc.
              };
            } else {
              return {
                item: new mongoose.Types.ObjectId(i.id), // normal item
                price: i.price,
                quantity: i.quantity,
                name: i.name,
                type: i.type,
              };
            }
          }),
        };
      })
    );

    //  User ID from request
    const userId = req.userId;

    //  Create order
    const newOrder = await Order.create({
      user: userId,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      shopOrder,
    });

    //  Populate only normal items
    await newOrder.populate({
      path: "shopOrder.shopOrderItems.item",
      select: "name image price",
      match: { _id: { $ne: null } }, // skip print items
    });

    await newOrder.populate("shopOrder.shop", "name");
    await newOrder.populate("shopOrder.owner", "name socketId");
    await newOrder.populate("user", "name email mobile");


    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrder.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;

        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrder: [shopOrder],
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
          console.log(` New order emitted to vendor socket: ${ownerSocketId}`);
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("placeOrder error:", error.stack);
    return res.status(500).json({
      success: false,
      message: `placeOrder error: ${error.message}`,
    });
  }
};

//add socket io in a payment also

//  Get Orders for Logged-in User
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role === "student") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name")
        .populate("shopOrder.owner", "name email mobile")
        .populate("shopOrder.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role === "vendor") {
      const orders = await Order.find({ "shopOrder.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrder.shop", "name")
        .populate("user", "fullName email mobile")
        .populate("shopOrder.shopOrderItems.item", "name image price")
        .populate("shopOrder.assignedDeliveryBoy", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrder: order.shopOrder.filter(
          (o) => o.owner._id.toString() === req.userId.toString()
        ),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        totalAmount: order.totalAmount,
      }));
      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//  Update Order Status & Assign Delivery Boy
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrder.find((o) => o.shop.toString() === shopId);
    if (!shopOrder)
      return res.status(400).json({ message: "Shop order not found" });

    shopOrder.status = status;
    let deliveryBoysPayload = [];

    // Assign delivery boys if order is out for delivery
    if (status === "out of delivery" || !shopOrder.assignment) {
      const deliveryBoys = await User.find({ role: "delivery" });
      const deliveryBoyIds = deliveryBoys.map((boy) => boy._id);

      // Find busy delivery boys
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: deliveryBoyIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = deliveryBoys.filter(
        (boy) => !busyIdSet.has(String(boy._id))
      );

      if (!availableBoys.length) {
        await order.save();
        return res.json({
          message: "Order status updated but no available delivery boys",
          shopOrder,
          assignedDeliveryBoy: null,
          availableBoys: [],
          assignment: null,
        });
      }

      // Create delivery assignment
      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: availableBoys.map((boy) => boy._id),
        status: "broadcasted",
      });

      shopOrder.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableBoys.map((boy) => ({
        id: boy._id,
        fullName: boy.fullName,
        mobile: boy.mobile,
      }));

      await deliveryAssignment.populate('order')
      await deliveryAssignment.populate('shop')

      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;

          console.log("Delivery boy:", boy.fullName, "Socket:", boy.socketId);
          
          if (boySocketId) {
            io.to(boySocketId).emit('newAssignment', {
              sentTo:boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order._id,
              shopName: deliveryAssignment.shop?.name,
              deliveryAddress: deliveryAssignment.order.deliveryAddress,
              items:
                deliveryAssignment.order.shopOrder.find(
                  (so) => so._id.toString() === deliveryAssignment.shopOrderId.toString()
                )?.shopOrderItems || [],
              subtotal:
                deliveryAssignment.order.shopOrder.find(
                  (so) => so._id.toString() === deliveryAssignment.shopOrderId.toString()
                )?.subtotal || 0,
            });
          }
        });
      }
    }

    await order.save();

    const updatedShopOrder = order.shopOrder.find(
      (o) => o.shop.toString() === shopId.toString()
    );
    await order.populate("shopOrder.shop", "name");
    await order.populate("user", "socketId");

    const io = req.app.get("io");

    if (io) {
      const userSocketId = order.user.socketId;

      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder.assignedDeliveryBoy || null,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder.assignment,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Order status error", error: error.message });
  }
};

//  Get Assignments for Delivery Boy
export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop?.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrder.find(
          (so) => so._id.toString() === a.shopOrderId.toString()
        )?.shopOrderItems || [],
      subtotal:
        a.order.shopOrder.find(
          (so) => so._id.toString() === a.shopOrderId.toString()
        )?.subtotal || 0,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("GET DELIVERY ASSIGNMENT ERROR:", error);
    return res
      .status(500)
      .json({ message: `get assignment error: ${error.message}` });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }
    if (assignment.status !== "broadcasted") {
      return res.status(400).json({ message: "assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order" });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    let shopOrder = order.shopOrder.id(assignment.shopOrderId);
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();

    return res.status(200).json({
      message: "order accepted",
    });
  } catch (error) {
    return res.status(500).json({ message: "accept order  error" });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName email mobile location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName email location mobile" }],
      });

   
    if (!assignment) {
  return res.status(200).json({ order: null });
}

    if (!assignment.order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shopOrder = assignment.order.shopOrder.find(
      (so) => String(so._id) == String(assignment.shopOrderId)
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "shopOrder not found" });
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "current order error" });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrder.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "enter valid order/shopOrderId" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;

    await order.save();
    await sendDeliveryOtpMail(order.user, otp);

    return res
      .status(200)
      .json({ message: `Otp sent Successfully to ${order?.user?.fullName}` });
  } catch (error) {
    return res.status(500).json({ message: " delivery otp error ${error}" });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrder.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "enter valid order/shopOrderId" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid/Expired Otp" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();

    await order.save();

    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({ message: "Order Delivered Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " verify delivery otp error ${error}" });
  }
};
