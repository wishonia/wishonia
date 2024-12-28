import React, { useState } from 'react'

import { Input } from './input'

interface ComboboxProps {
    items: any[]
    onInputChange: (value: string) => void
    onSelectItem: (item: any) => void
    placeholder?: string
}

export function Combobox({ items, onInputChange, onSelectItem, placeholder }: ComboboxProps) {
    const [inputValue, setInputValue] = useState('')

    return (
        <div>
            <Input
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    onInputChange(e.target.value)
                }}
                placeholder={placeholder}
            />
            {items.length > 0 && (
                <ul>
                    {items.map((item, index) => (
                        <li key={index} onClick={() => onSelectItem(item)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}