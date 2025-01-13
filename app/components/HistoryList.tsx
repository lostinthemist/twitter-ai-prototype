"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useId } from "react";

interface HistoryListProps {
  history: string[];
}

export default function HistoryList({ history }: Readonly<HistoryListProps>) {
  const id = useId();

  const handleCopy = (tweet: string) => {
    navigator.clipboard.writeText(tweet);
  };

  const updatedHistory = history.slice(1);

  return (
    <div className="w-full mt-6">
      {history.length > 0 && (
        <h2 className="text-lg text-white font-semibold mb-4">Tweet History</h2>
      )}
      <div className="grid grid-cols-1 gap-4">
        {updatedHistory.map((tweet, index) => (
          <Card key={`${id}-${index}`} className="bg-gray-800 border-gray-700 hover:bg-gray-700">
            <CardContent className="p-4 flex justify-between items-center">
              <p className="text-white text-sm">{tweet}</p>
              <Button
                onClick={() => handleCopy(tweet)}
                variant="secondary"
                className="text-white gap-2 flex items-center justify-center h-8 px-3 text-xs font-medium rounded-md hover:text-slate-400 transition-all"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
