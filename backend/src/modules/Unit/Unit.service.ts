import { type Unit } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UnitService {

  @LogMessage<[Unit]>({ message: 'test-decorator' })
  public async createUnit(data: Unit) {
    const unit = await prisma.unit.create({ data });
    return unit;
  }

  // TODO log the calls
  //@LogMessage<[units]>({message: 'get all'})
  public async getUnits() {
    const unit = await prisma.unit.findMany()
    return unit;
  }

  public async deleteUnits(){
    const { count } = await prisma.unit.deleteMany()
    return count
  }
}
//