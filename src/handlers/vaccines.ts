import { APIGatewayProxyHandler } from "aws-lambda";

import { VaccineModel } from "../models/Vaccine";
import { PetModel } from "../models/Pet";
import { CreateVaccineRequest, UpdateVaccineRequest } from "../types";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "../utils/response";

// Crear vacuna
export const create: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return validationErrorResponse("Request body is required");
    }

    const vaccineData: CreateVaccineRequest = JSON.parse(event.body);

    // Validaciones básicas
    if (
      !vaccineData.petId ||
      !vaccineData.vaccineName ||
      !vaccineData.applicationDate
    ) {
      return validationErrorResponse(
        "petId, vaccineName and applicationDate are required",
      );
    }

    // Verificar que la mascota existe
    const pet = await PetModel.getById(vaccineData.petId);
    if (!pet) {
      return validationErrorResponse("Pet not found");
    }

    // Validar fechas
    const appDate = new Date(vaccineData.applicationDate);
    const expDate = new Date(vaccineData.expirationDate);

    if (isNaN(appDate.getTime())) {
      return validationErrorResponse("Invalid application date");
    }

    if (isNaN(expDate.getTime())) {
      return validationErrorResponse("Invalid expiration date");
    }

    if (expDate <= appDate) {
      return validationErrorResponse(
        "Expiration date must be after application date",
      );
    }

    const vaccine = await VaccineModel.create(vaccineData);

    return successResponse(vaccine, 201);
  } catch (error) {
    console.error("Error creating vaccine:", error);
    return errorResponse("Could not create vaccine");
  }
};

// Obtener vacuna por ID
export const getById: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Vaccine ID is required");
    }

    const vaccine = await VaccineModel.getById(id);

    if (!vaccine) {
      return notFoundResponse("Vaccine");
    }

    return successResponse(vaccine);
  } catch (error) {
    console.error("Error getting vaccine:", error);
    return errorResponse("Could not get vaccine");
  }
};

// Obtener todas las vacunas
export const getAll: APIGatewayProxyHandler = async (event) => {
  try {
    const vaccines = await VaccineModel.getAll();
    return successResponse(vaccines);
  } catch (error) {
    console.error("Error getting vaccines:", error);
    return errorResponse("Could not get vaccines");
  }
};

// Obtener vacunas por mascota
export const getByPetId: APIGatewayProxyHandler = async (event) => {
  try {
    const { petId } = event.pathParameters || {};

    if (!petId) {
      return validationErrorResponse("Pet ID is required");
    }

    // Verificar que la mascota existe
    const pet = await PetModel.getById(petId);
    if (!pet) {
      return notFoundResponse("Pet");
    }

    const vaccines = await VaccineModel.getByPetId(petId);
    return successResponse(vaccines);
  } catch (error) {
    console.error("Error getting vaccines by pet:", error);
    return errorResponse("Could not get vaccines");
  }
};

// Actualizar vacuna
export const update: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Vaccine ID is required");
    }

    if (!event.body) {
      return validationErrorResponse("Request body is required");
    }

    const updates: UpdateVaccineRequest = JSON.parse(event.body);

    // Validar fechas si se proporcionan
    if (updates.applicationDate) {
      const appDate = new Date(updates.applicationDate);
      if (isNaN(appDate.getTime())) {
        return validationErrorResponse("Invalid application date");
      }
    }

    if (updates.expirationDate) {
      const expDate = new Date(updates.expirationDate);
      if (isNaN(expDate.getTime())) {
        return validationErrorResponse("Invalid expiration date");
      }
    }

    const updatedVaccine = await VaccineModel.update(id, updates);

    if (!updatedVaccine) {
      return notFoundResponse("Vaccine");
    }

    return successResponse(updatedVaccine);
  } catch (error) {
    console.error("Error updating vaccine:", error);
    return errorResponse("Could not update vaccine");
  }
};

// Eliminar vacuna
export const deleteVaccine: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return validationErrorResponse("Vaccine ID is required");
    }

    // Verificar que la vacuna existe
    const vaccine = await VaccineModel.getById(id);
    if (!vaccine) {
      return notFoundResponse("Vaccine");
    }

    const deleted = await VaccineModel.delete(id);

    if (!deleted) {
      return errorResponse("Could not delete vaccine");
    }

    return successResponse({ message: "Vaccine deleted successfully" });
  } catch (error) {
    console.error("Error deleting vaccine:", error);
    return errorResponse("Could not delete vaccine");
  }
};
