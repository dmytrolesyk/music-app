import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GenresTagInputProps {
  genres: string[];
  value: string[];
  onChange: (genres: string[]) => void;
}

export const GenresTagInput: React.FC<GenresTagInputProps> = ({ genres, value, onChange }) => {
  const [selectValue, setSelectValue] = useState<string>('');

  const availableGenres = genres.filter(genre => !value.includes(genre));

  const handleAddGenre = (genre: string) => {
    if (genre && !value.includes(genre)) {
      onChange([...value, genre]);
      setSelectValue('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    onChange(value.filter(genre => genre !== genreToRemove));
    setSelectValue('');
  };

  return (
    <div data-test-id="genre-selector" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {value.map(genre => (
          <Badge key={genre} className="py-1 px-2 flex items-center gap-1">
            {genre}
            <Button
              type="button"
              onClick={() => handleRemoveGenre(genre)}
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {genre}</span>
            </Button>
          </Badge>
        ))}
      </div>

      <Select
        value={selectValue}
        onValueChange={genre => {
          handleAddGenre(genre);
          setSelectValue('');
        }}
        disabled={availableGenres.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select genre to add" />
        </SelectTrigger>
        <SelectContent>
          {availableGenres.map(genre => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
