import { APIGatewayProxyHandler } from "aws-lambda";

import { PetModel } from "../models/Pet";
import { CreatePetRequest, UpdatePetRequest } from "../types";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "../utils/response";

// Crear mascota
export const create: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return validationErrorResponse("Request body is required");
    }

    const petData: CreatePetRequest = JSON.parse(event.body);

    // Validaciones básicas
    if (
      !petData.name ||
      !petData.species ||
      !petData.ownerId ||
      !petData.ownerName
    ) {
      return validationErrorResponse(
        "Name, species, ownerId and ownerName are required",
      );
    }

    if (petData.age < 0 || petData.weight <= 0) {
      return validationErrorResponse(
        "Age must be positive and weight must be greater than 0",
      );
    }

    const pet = await PetModel.create(petData);

    return successResponse(pet, 201);
  } catch (error) {
    console.error("Error creating pet:", error);
    return errorResponse("Could not create pet");
  }
};

// Obtener mascota por ID
export const getById: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Pet ID is required");
    }

    const pet = await PetModel.getById(id);

    if (!pet) {
      return notFoundResponse("Pet");
    }

    return successResponse(pet);
  } catch (error) {
    console.error("Error getting pet:", error);
    return errorResponse("Could not get pet");
  }
};

// Obtener todas las mascotas
export const getAll: APIGatewayProxyHandler = async (event) => {
  try {
    const pets = await PetModel.getAll();
    return successResponse(pets);
  } catch (error) {
    console.error("Error getting pets:", error);
    return errorResponse("Could not get pets");
  }
};

// Actualizar mascota
export const update: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Pet ID is required");
    }

    if (!event.body) {
      return validationErrorResponse("Request body is required");
    }

    const updates: UpdatePetRequest = JSON.parse(event.body);

    // Validar datos si se proporcionan
    if (updates.age !== undefined && updates.age < 0) {
      return validationErrorResponse("Age must be positive");
    }

    if (updates.weight !== undefined && updates.weight <= 0) {
      return validationErrorResponse("Weight must be greater than 0");
    }

    const updatedPet = await PetModel.update(id, updates);

    if (!updatedPet) {
      return notFoundResponse("Pet");
    }

    return successResponse(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    return errorResponse("Could not update pet");
  }
};

// Eliminar mascota
export const deletePet: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Pet ID is required");
    }

    // Verificar que la mascota existe antes de eliminar
    const pet = await PetModel.getById(id);
    if (!pet) {
      return notFoundResponse("Pet");
    }

    const deleted = await PetModel.delete(id);

    if (!deleted) {
      return errorResponse("Could not delete pet");
    }

    return successResponse({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return errorResponse("Could not delete pet");
  }
};

// Obtener mascotas por dueño
export const getByOwnerId: APIGatewayProxyHandler = async (event) => {
  try {
    const { ownerId } = event.pathParameters || {};

    if (!ownerId) {
      return validationErrorResponse("Owner ID is required");
    }

    const pets = await PetModel.getByOwnerId(ownerId);
    return successResponse(pets);
  } catch (error) {
    console.error("Error getting pets by owner:", error);
    return errorResponse("Could not get pets");
  }
};
