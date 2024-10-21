import { Progress } from "~/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface UploadedFileProps {
  name: string;
  studentId?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export function UploadedFileItem({ name, studentId, progress, status }: UploadedFileProps) {
  const truncatedName = name.length > 20 ? name.substring(0, 17) + '...' : name;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <li className="flex items-center space-x-2 p-2 hover:dark:bg-gray-800 hover:bg-gray-100 rounded">
            <span className={`flex-grow ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
              {truncatedName} {studentId && `- Student ID: ${studentId}`}
            </span>
            <Progress value={progress} className="w-24" />
            <span className="w-20 text-right text-sm">
              {status === 'uploading' ? 'Uploading...' : status === 'success' ? 'Uploaded' : 'Failed'}
            </span>
          </li>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}