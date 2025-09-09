import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";

import { Pet, CreatePetRequest, UpdatePetRequest } from "../types";

const dynamoDB = new DynamoDB.DocumentClient();
const PETS_TABLE = process.env.PETS_TABLE!;

export class PetModel {
  static async create(petData: CreatePetRequest): Promise<Pet> {
    const now = new Date().toISOString();

    const pet: Pet = {
      id: uuid(),
      ...petData,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB
      .put({
        TableName: PETS_TABLE,
        Item: pet,
      })
      .promise();

    return pet;
  }

  static async getById(id: string): Promise<Pet | null> {
    const result = await dynamoDB
      .get({
        TableName: PETS_TABLE,
        Key: { id },
      })
      .promise();

    return (result.Item as Pet) || null;
  }

  static async getAll(): Promise<Pet[]> {
    const result = await dynamoDB
      .scan({
        TableName: PETS_TABLE,
      })
      .promise();

    return (result.Items as Pet[]) || [];
  }

  static async update(
    id: string,
    updates: UpdatePetRequest,
  ): Promise<Pet | null> {
    const existingPet = await this.getById(id);
    if (!existingPet) return null;

    const updatedPet = {
      ...existingPet,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB
      .put({
        TableName: PETS_TABLE,
        Item: updatedPet,
      })
      .promise();

    return updatedPet;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await dynamoDB
        .delete({
          TableName: PETS_TABLE,
          Key: { id },
        })
        .promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getByOwnerId(ownerId: string): Promise<Pet[]> {
    const result = await dynamoDB
      .scan({
        TableName: PETS_TABLE,
        FilterExpression: "ownerId = :ownerId",
        ExpressionAttributeValues: {
          ":ownerId": ownerId,
        },
      })
      .promise();

    return (result.Items as Pet[]) || [];
  }
}
