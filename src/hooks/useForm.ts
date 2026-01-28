import { useState } from 'react';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type FormValues = Record<string, string>;

type UseFormReturn<T extends FormValues> = {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: Dispatch<SetStateAction<T>>;
};

export function useForm<T extends FormValues = FormValues>(
  inputValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  return { values, handleChange, setValues };
}
