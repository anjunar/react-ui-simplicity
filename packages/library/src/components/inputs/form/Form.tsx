import "./Form.css"
import React, {createContext, CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo} from "react"
import {AsyncValidator, Error, FormModel, Validator} from "../../shared/Model";
import {debounce} from "../../shared/Utils";

function Form(properties: Form.Attributes) {

    const {children, onModel, onSubmit, onInput, onErrors, validators, asyncValidators, value, ...rest} = properties

    const form = useMemo(() => {
        return new FormModel(undefined, value)
    }, [])

    const onSubmitHandler = useCallback((event : MouseEvent) => {
            event.stopPropagation()
            event.preventDefault()

            let name = (event.target as HTMLButtonElement).name

            if (!name.endsWith("force")) {
                form.validateFields()
                form.triggerCallbacks()
            }

            if (onSubmit) {
                onSubmit(name.replace("-force", ""), form)
            }

            return false
        },
        [form]
    )

    useLayoutEffect(() => {

        let callbacks = debounce((validate: boolean) => {
            if (validate) {
                form.validate()
            }
            let errors = form.collectErrors();

            for (const er of errors) {
                for (const er1 of er.errors) {
                    if (er1.payload) {
                        for (const error of er1.payload) {
                            let input = form.findModel(Array.from(error.path), form);

                            if (input?.errors.findIndex((er: any) => error.message === er.message) === -1) {
                                input.errors.push({
                                    type: "server",
                                    path: error.path.join("."),
                                    message: error.message,
                                    invalidValue: input.value[input.name]
                                })
                                input.fireCallbacks(false)
                            }
                        }
                    }
                }
            }

            if (onErrors) {
                onErrors(errors)
            }

        }, 30)

        form.callbacks.push(callbacks)

        if (validators) {
            for (const validator of validators) {
                form.addValidator(validator)
            }
        }

        if (asyncValidators) {
            for (const asyncValidator of asyncValidators) {
                form.addAsyncValidator(asyncValidator)
            }
        }

        let buttons = new Map<HTMLButtonElement, (event : MouseEvent) => void>

        form.registerButtons.push((button) => {
            let handler = (event : MouseEvent) => {
                onSubmitHandler(event)
            };
            button.addEventListener("click", handler)
            buttons.set(button, handler)
        })

        form.removeButtons.push((button) => {
            let handler = buttons.get(button);
            button.removeEventListener("click", handler)
        })

    }, []);

    return (
        <fieldset {...rest} className={`form${form.dirty ? " dirty" : " pristine"}${form.valid ? " valid" : " invalid"}`}>
            <FormContext.Provider value={form}>{children}</FormContext.Provider>
        </fieldset>
    )
}

namespace Form {
    export interface Attributes {
        autoComplete? : string
        children: React.ReactNode
        onModel?: any
        onSubmit? : (name : string, form : FormModel) => void
        onInput?: any,
        onErrors?: (errors: Error[]) => void
        value: any,
        validators?: Validator[],
        asyncValidators?: AsyncValidator[]
        style? : CSSProperties
    }
}

export default Form

export const FormContext = createContext(null)