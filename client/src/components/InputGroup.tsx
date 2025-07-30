import { Media } from "@/types/Media";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";

export const InputGroup = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof Media;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-col gap-2 sm:grid sm:grid-cols-4 sm:items-center font-semibold sm:gap-4">
    <Label htmlFor={name} className="">
      {label}
    </Label>
    <Input
      id={name}
      name={name}
      className="sm:col-span-3"
      value={value}
      onChange={onChange}
    />
  </div>
);
