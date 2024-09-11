import {type VivaQuestion} from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class VivaQuestionService {
  @LogMessage<[VivaQuestion]>({ message: 'test-decorator' })
  
  public async createVivaQuestion(data: VivaQuestion) {
    const vivaQuestion = await prisma.vivaQuestion.create({ data });
    return vivaQuestion;
  }

  // TODO log the calls
  //@LogMessage<[users]>({message: 'get all'})
  public async getAll() {
    const vivaQuestion = await prisma.vivaQuestion.findMany()
    return vivaQuestion;
  }

  public async deleteAll(){
    const { count } = await prisma.vivaQuestion.deleteMany()
    return count
  }
}