import {type VivaQuestion} from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class VivaQuestionService {
  @LogMessage<[VivaQuestion]>({ message: 'test-decorator' })
  
  public async create(data: VivaQuestion) {

    const vivaQuestion = await prisma.vivaQuestion.create({ data });
    return vivaQuestion;
  }

  public async get(id: string){
    const vivaQuestion =  await prisma.vivaQuestion.findUnique({
      where: { id },
    });
      return vivaQuestion;
  }

  // TODO log the calls
  //@LogMessage<[users]>({message: 'get all'})
  public async getAll() {
    const vivaQuestion = await prisma.vivaQuestion.findMany()
    return vivaQuestion;
  }

  public async delete(id: string){
    const vivaQuestion =  await prisma.vivaQuestion.delete({
      where: { id },
    });
      return vivaQuestion;
  }

  public async deleteAll(){
    const { count } = await prisma.vivaQuestion.deleteMany()
    return count
  }
}