import { Request, Response } from "express";
import { DeliveryAddressModel } from "../models/address";

export const getAddressById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const address = await DeliveryAddressModel.find({id:id});
    if (!address) {
      return res.status(200).json({ address:[] });
    }
    res.status(200).json({ address });
  } catch (error) {
    console.error(`Error fetching address with ID ${id}:`, error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const addDeliveryAddress = async (req: Request, res: Response) => {
  const { id, name, address, city, state, pincode, mob } = req.body;

  try {
    const newAddress = new DeliveryAddressModel({
      id,
      name,
      address,
      city,
      state,
      pincode,
      mob,
    });
    const savedAddress = await newAddress.save();
    return res.status(201).json({
      message: "Delivery address added successfully.",
      address: savedAddress,
    });
  } catch (error) {
    console.error("Error adding delivery address:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const editDeliveryAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;
  const { id, name, address, city, state, pincode, mob } = req.body;

  try {
    const updatedAddress = await DeliveryAddressModel.findByIdAndUpdate(
      addressId,
      { id, name, address, city, state, pincode, mob },
      { new: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ error: "Delivery address not found." });
    }
    return res.status(200).json({
      message: "Delivery address updated successfully.",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error editing delivery address:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteDeliveryAddress = async (req: Request, res: Response) => {
  const { addressId } = req.params;

  try {
    const deletedAddress = await DeliveryAddressModel.findByIdAndDelete(
      addressId
    );
    if (!deletedAddress) {
      return res.status(404).json({ error: "Delivery address not found." });
    }
    return res
      .status(200)
      .json({ message: "Delivery address deleted successfully." });
  } catch (error) {
    console.error("Error deleting delivery address:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
