import { type Assignment, type Unit } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UnitService {
  @LogMessage<[Unit]>({ message: 'test-decorator' })

  public async create(data: Unit) {
    const unit = await prisma.unit.create({ data });
    return unit;
  }

  public async getUnits(limit: number, offset: number) {
    const units = await prisma.unit.findMany({
      skip: offset,
      take: limit,
    });
    return units;
  }
  

  public async getUnit(id: string) {
    const unit = await prisma.unit.findUnique({
      where: { id },
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

  public async delete(id: string){
    const unit =  await prisma.unit.delete({
      where: { id },
    });
      return unit;
  }

  public async deleteAll(){
    const { count } = await prisma.unit.deleteMany()
    return count
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