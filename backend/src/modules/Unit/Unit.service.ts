import { type Unit } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UnitService {
  @LogMessage<[Unit]>({ message: 'test-decorator' })
  public async createUnit(data: Unit) {
    const unit = await prisma.unit.create({ data });
    return unit;
  }

  public async getUnits() {
    const units = await prisma.unit.findMany();
    return units;
  }

  public async deleteUnits() {
    const { count } = await prisma.unit.deleteMany();
    return count;
  }

  public async updateUnitName(id: string, name: string) {
    const updatedUnit = await prisma.unit.update({
      where: { id },
      data: { name },
    });
    return updatedUnit;
  }
}