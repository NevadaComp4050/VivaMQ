import { type Assignment, type Unit } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UnitService {
  @LogMessage<[Unit]>({ message: 'test-decorator' })
  public async create(data: { name: string; year: number; ownerId: string }) {
    console.log('create unit service', data);

    const unit = await prisma.unit.create({
      data: {
        name: data.name,
        year: data.year,
        ownerId: data.ownerId,
      },
    });
    return unit;
  }

  public async getUnits(ownerId: string, limit: number, offset: number) {
    const units = await prisma.unit.findMany({
      where: { ownerId },
      skip: offset,
      take: limit,
    });
    return units;
  }

  public async getUnit(ownerId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        ownerId,
      },
    });
    return unit;
  }

  public async getAll() {
    const units = await prisma.unit.findMany();
    return units;
  }

  public async updateUnitName(id: string, name: string) {
    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: { name },
    });
    return updatedUnit;
  }

  public async delete(id: string) {
    const unit = await prisma.unit.delete({
      where: { id },
    });
    return unit;
  }

  public async deleteAll() {
    const { count } = await prisma.unit.deleteMany();
    return count;
  }

  public async createAssignment(unitId: string, data: Assignment) {
    const assignment = await prisma.assignment.create({
      data: {
        ...data,
        unitId,
      },
    });
    return assignment;
  }

  public async getAssignments(unitId: string, limit: number, offset: number) {
    const assignments = await prisma.assignment.findMany({
      where: { unitId },
      skip: offset,
      take: limit,
    });
    return assignments;
  }
}
