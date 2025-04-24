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
  const [selectedGenres, setSelectedGenres] = useState<string[]>(value || []);
  const [selectValue, setSelectValue] = useState<string>('');

  const availableGenres = genres.filter(genre => !selectedGenres.includes(genre));

  const handleAddGenre = (genre: string) => {
    if (genre && !selectedGenres.includes(genre)) {
      const newGenres = [...selectedGenres, genre];
      setSelectedGenres(newGenres);
      onChange(newGenres);
      setSelectValue('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    const newGenres = selectedGenres.filter(genre => genre !== genreToRemove);
    setSelectedGenres(newGenres);
    onChange(newGenres);
    setSelectValue('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedGenres.map(genre => (
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
        onValueChange={value => {
          handleAddGenre(value);
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
