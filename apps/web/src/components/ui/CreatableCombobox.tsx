import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface CreatableComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  onCreateNew?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CreatableCombobox({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  emptyText = 'No se encontraron resultados.',
  onCreateNew,
  disabled = false,
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2 text-sm font-semibold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden text-foreground transition-colors',
            className
          )}
          disabled={disabled}
        >
          <span className="truncate block flex-1 text-left">
            {value ? options.find((option) => option.value === value)?.label || value : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-background border border-border shadow-xl rounded-md z-50 overflow-hidden" align="start">
        <Command className="bg-background">
          <CommandInput placeholder={placeholder} onValueChange={setInputValue} className="bg-background border-none focus:ring-0" />
          <CommandList className="bg-background">
            <CommandEmpty className="py-2 px-4 flex flex-col gap-2 items-center text-sm">
              <span className="text-muted-foreground">{emptyText}</span>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {onCreateNew && inputValue.trim() !== '' && !options.find(o => o.label.toLowerCase() === inputValue.trim().toLowerCase()) && (
              <CommandGroup forceMount>
                <CommandItem
                  value={inputValue}
                  forceMount
                  onSelect={() => {
                    onCreateNew(inputValue);
                    onChange(inputValue);
                    setOpen(false);
                    setInputValue('');
                  }}
                  className="text-primary font-bold justify-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear &quot;{inputValue}&quot;
                </CommandItem>
              </CommandGroup>
            )}

          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
