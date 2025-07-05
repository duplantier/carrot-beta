import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleQuestionMark } from "lucide-react";
const ComingSoon = ({ description }: { description: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleQuestionMark className="w-4 h-4 ml-2 hover:text-orange-500" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ComingSoon;
