
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface DocumentTagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function DocumentTagsInput({ tags, onTagsChange }: DocumentTagsInputProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <Label className="text-sm font-medium">Tags</Label>
      <div className="flex gap-2 mb-2 mt-1">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Digite uma tag"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          className="h-8 text-sm"
        />
        <Button type="button" onClick={handleAddTag} size="sm" className="h-8 px-2">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs h-6">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              <X className="w-2 h-2" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
