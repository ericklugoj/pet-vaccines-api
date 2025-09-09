import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { Vaccine, CreateVaccineRequest, UpdateVaccineRequest } from "../types";

const dynamoDB = new DynamoDB.DocumentClient();
const VACCINES_TABLE = process.env.VACCINES_TABLE!;

export class VaccineModel {
  static async create(vaccineData: CreateVaccineRequest): Promise<Vaccine> {
    const now = new Date().toISOString();

    const vaccine: Vaccine = {
      id: uuid(),
      ...vaccineData,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB
      .put({
        TableName: VACCINES_TABLE,
        Item: vaccine,
      })
      .promise();

    return vaccine;
  }

  static async getById(id: string): Promise<Vaccine | null> {
    const result = await dynamoDB
      .get({
        TableName: VACCINES_TABLE,
        Key: { id },
      })
      .promise();

    return (result.Item as Vaccine) || null;
  }

  static async getAll(): Promise<Vaccine[]> {
    const result = await dynamoDB
      .scan({
        TableName: VACCINES_TABLE,
      })
      .promise();

    return (result.Items as Vaccine[]) || [];
  }

  static async getByPetId(petId: string): Promise<Vaccine[]> {
    const result = await dynamoDB
      .scan({
        TableName: VACCINES_TABLE,
        FilterExpression: "petId = :petId",
        ExpressionAttributeValues: {
          ":petId": petId,
        },
      })
      .promise();

    return (result.Items as Vaccine[]) || [];
  }

  static async update(
    id: string,
    updates: UpdateVaccineRequest,
  ): Promise<Vaccine | null> {
    const existingVaccine = await this.getById(id);
    if (!existingVaccine) return null;

    const updatedVaccine = {
      ...existingVaccine,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB
      .put({
        TableName: VACCINES_TABLE,
        Item: updatedVaccine,
      })
      .promise();

    return updatedVaccine;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await dynamoDB
        .delete({
          TableName: VACCINES_TABLE,
          Key: { id },
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }
}
