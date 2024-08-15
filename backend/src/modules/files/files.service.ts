import { File } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class FileService {
  //@LogMessage<[File[]]>({ message: 'Getting all files' })
  public async getFiles() {
    const files = await prisma.file.findMany();
    return files;
  }

  //@LogMessage<[File]>({ message: 'Mapping file to student' })
  public async mapFile(fileId: string, data: Partial<File>) {
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data,
    });

    return updatedFile;
  }
}