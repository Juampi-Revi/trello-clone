// Importa la biblioteca Zod, que se utiliza para definir y validar esquemas de datos en TypeScript.
import {z} from "zod";

//Define un tipo TypeScript FieldErrors<T> que representa los errores de validación de los campos de un objeto de tipo T.
export type FieldErrors<T> = {
    [K in keyof T] ?: string [];
};

//: Define un tipo TypeScript ActionState<TInput, TOutput> que representa el estado de una acción.
//Puede contener errores de campo (fieldErrors), un error general (error) y datos (data).
export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>;
    error?: string | null;
    data?: TOutput;
}

//Define una función createSafeAction que toma un esquema de validación schema y un controlador handler.
//Esta función devuelve una función asíncrona que toma datos de entrada y devuelve un estado de acción.
export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    //Es una función asíncrona que toma datos de tipo TInput como entrada y devuelve una promesa que se resuelve con un estado de acción de tipo ActionState<TInput, TOutput>.
    return async (data: TInput) : Promise<ActionState<TInput, TOutput>> => {
        //Utiliza el método safeParse del esquema proporcionado para validar los datos de entrada.
        const validationResult = schema.safeParse(data);
        //Verifica si la validación fue exitosa. Si no, devuelve un objeto con los errores de campo generados por la validación.
        if(!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>
            }
        }

        //Si la validación fue exitosa, ejecuta el controlador (handler) con los datos validados y devuelve el resultado.
        return handler(validationResult.data);
    }
}

//En resumen, esta función createSafeAction proporciona una forma de encapsular la validación de datos utilizando Zod
// y ejecutar una acción si los datos son válidos, devolviendo un estado de acción que incluye datos o errores según corresponda.