import "./Input.css"
import React, {CSSProperties, useCallback, useLayoutEffect, useRef, useState} from "react"
import {
    Model,
    AsyncValidator,
    Email,
    Max,
    MaxLength,
    Min,
    MinLength,
    Pattern,
    Required,
    Validator
} from "../../shared/Model"
import {Duration, LocalDate, LocalDateTime, LocalTime, Temporal, TemporalAmount} from "@js-joda/core";
import {format} from "../../shared/DateTimeUtils";
import {useInput} from "../../../hooks/UseInputHook";

function Input(properties: Input.Attributes) {

    const {
        asyncValidators = [],
        autoComplete,
        disabled,
        dynamicWidth = false,
        email,
        max,
        maxLength,
        min,
        minLength,
        name = "default",
        onBlur,
        onChange,
        onFocus,
        onModel,
        past,
        pattern,
        required,
        size,
        standalone = false,
        style,
        subType,
        type,
        validators = [],
        value,
        ...rest
    } = properties

    let [model, state, setState] = useInput(name, value, standalone, type);

    const input = useRef(null);

    const onInputHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        let target = event.target

        let converted = parseValue(target);

        setState(converted)

        if (onChange) {
            onChange(converted)
        }

        if (onModel) {
            onModel(model)
        }

    }, [])

    useLayoutEffect(() => {

        if (required) {
            model.addValidator(new Required())
        }
        if (min) {
            model.addValidator(new Min(min))
        }
        if (max) {
            model.addValidator(new Max(max))
        }
        if (minLength) {
            model.addValidator(new MinLength(minLength))
        }
        if (maxLength) {
            model.addValidator(new MaxLength(maxLength))
        }
        if (pattern) {
            model.addValidator(new Pattern(pattern))
        }

        if (type === "email") {
            model.addValidator(new Email())
        }

        for (const asyncValidator of asyncValidators) {
            model.addAsyncValidator(asyncValidator)
        }

        for (const validator of validators) {
            model.addValidator(validator)
        }

        // For form validation -> Error messages
        model.callbacks.push((validate: boolean) => {
            if (onModel) {
                onModel(model)
            }
        })

        if (onModel) {
            onModel(model)
        }

        let element = input.current;

        element.addEventListener("blur", () => {
            setTimeout(() => {
                if (dynamicWidth) {
                    element.style.width = calculateWidth(type)
                }
            },300)
        })

        function getElementTextWidth(text: string, style?: any) {
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.whiteSpace = 'nowrap';
            span.style.font = style?.font || '16px Helvetica';
            document.body.appendChild(span);

            span.textContent = text;
            const width = span.offsetWidth;
            document.body.removeChild(span);

            return width;
        }

        function calculateWidth(type: string) {
            let ratio = 1
            if (element.value.length === 0 && type === "text") {
                return `${ratio}ch`
            }
            switch (type) {
                case "number" :
                    return 6 + getElementTextWidth(element.value) + "px"
                case "duration" :
                    return 6 + getElementTextWidth(element.value) + "px"
                case "date" :
                    return `${3 + element.value.length * ratio}ch`;
                case "datetime-local" :
                    return `${4 + element.value.length * ratio}ch`;
                case "time" :
                    return `9ch`;
                default :
                    return getElementTextWidth(element.value) + "px"
            }
        }

        if (dynamicWidth) {
            element.addEventListener('input', () => {
                element.style.width = calculateWidth(type);
            });

            element.style.width = calculateWidth(type)
        }

    }, [])

    useLayoutEffect(() => {
        if (onModel) {
            onModel(model)
        }
    }, [value, model.dirty]);

    function parseValue(target: HTMLInputElement) {
        try {
            switch (type) {
                case "checkbox" :
                    return target.checked
                case "number" :
                    return target.valueAsNumber
                case "datetime-local" : {
                    if (subType) {
                        let localTime = LocalTime.parse(target.value);
                        let localDateTime = state as LocalDateTime;
                        return LocalDateTime.of(localDateTime.toLocalDate(), localTime)
                    }
                    return LocalDateTime.parse(target.value)
                }
                case "date" :
                    return LocalDate.parse(target.value)
                case "time" :
                    return LocalTime.parse(target.value)
                case "duration" :
                    return Duration.ofMinutes(target.valueAsNumber)
                default :
                    return target.value
            }
        } catch (e) {
            return ""
        }
    }

    function formatValue(): string | number | readonly string[] {
        if (state === undefined || state === null || state === "") {
            return ""
        }
        switch (type) {
            case "checkbox":
                return state.toString()
            case "datetime-local" : {
                let localDateTime = state as LocalDateTime;
                if (subType) {
                    return localDateTime.toLocalTime().toJSON()
                }
                return localDateTime.toJSON();
            }
            case "date" :
                return (state as LocalDate).toJSON();
            case "time" :
                return format((state as LocalTime), "HH:mm")
            case "duration" :
                return (state as Duration).toMinutes()
            default :
                return state as string
        }
    }

    return (
        <input
            autoComplete={autoComplete}
            checked={typeof state === "boolean" ? state : false}
            className={`input${typeof state === "boolean" ? state ? " checked" : " unchecked" : ""}${model.dirty ? " dirty" : " pristine"}${model.valid ? " valid" : " error"}${document.activeElement === input.current ? " focus" : " blur"}`}
            disabled={disabled}
            name={name}
            onBlur={onBlur}
            onChange={onInputHandler}
            onFocus={onFocus}
            ref={input}
            style={{width: "100%"}}
            type={subType || type}
            value={formatValue()}
            {...rest}
        />
    )


}

namespace Input {
    export interface Attributes {
        asyncValidators?: AsyncValidator[],
        autoComplete?: string
        disabled?: boolean,
        dynamicWidth?: boolean
        email?: boolean,
        max?: number
        maxLength?: number
        min?: number
        minLength?: number
        name?: string
        onBlur? : () => void
        onChange?: (value: Temporal | TemporalAmount | string | number | boolean) => void
        onFocus? : () => void
        onModel?: (value: Model) => void
        past?: boolean,
        pattern?: string
        required?: boolean,
        size?: number
        standalone?: boolean
        style?: CSSProperties
        subType?: string
        type: string
        validators?: Validator[]
        value?: Temporal | TemporalAmount | string | number | boolean
    }
}

export default Input