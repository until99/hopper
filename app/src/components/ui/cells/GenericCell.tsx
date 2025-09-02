import { type ReactNode } from 'react';
import { CopyIcon, PencilIcon, TrashIcon } from '@phosphor-icons/react';
import { Button } from '../button';


export type CellType = 'text' | 'badge' | 'truncated-copy' | 'actions';

export interface BadgeConfig {
    color: 'blue' | 'green' | 'emerald' | 'violet' | 'yellow' | 'slate';
}

export interface TruncatedCopyConfig {
    maxLength?: number;
    onCopy: (value: string) => void;
}

export interface ActionsConfig {
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    editLabel?: string;
    deleteLabel?: string;
}

export interface StyleConfig {
    className?: string;
    textSize?: 'xs' | 'sm' | 'base' | 'lg';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textColor?: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface GenericCellProps {
    type: CellType;
    value?: any;
    children?: ReactNode;
    style?: StyleConfig;
    badgeConfig?: BadgeConfig;
    truncatedCopyConfig?: TruncatedCopyConfig;
    actionsConfig?: ActionsConfig;
    item?: any;
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    violet: 'bg-violet-100 text-violet-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    slate: 'bg-slate-100 text-slate-800',
};

const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
};

const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
};

const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export const GenericCell = ({
    type,
    value,
    children,
    style = {},
    badgeConfig,
    truncatedCopyConfig,
    actionsConfig,
    item
}: GenericCellProps) => {
    const {
        className = '',
        textSize = 'sm',
        fontWeight = 'normal',
        textColor = 'text-gray-900',
        alignment = 'left'
    } = style;

    const baseClasses = `${textSizeClasses[textSize]} ${fontWeightClasses[fontWeight]} ${textColor} ${alignmentClasses[alignment]} ${className}`;

    switch (type) {
        case 'text':
            return (
                <div className={baseClasses}>
                    {children || value}
                </div>
            );

        case 'badge':
            if (!badgeConfig) return null;
            return (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[badgeConfig.color]} ${className}`}>
                    {children || value}
                </span>
            );

        case 'truncated-copy':
            if (!truncatedCopyConfig) return null;
            const maxLength = truncatedCopyConfig.maxLength || 8;
            const displayValue = typeof value === 'string' ? value : String(value || '');
            const truncatedValue = displayValue.length > maxLength
                ? `${displayValue.slice(0, maxLength)}...`
                : displayValue;

            return (
                <div className={`flex items-center gap-2 ${className}`}>
                    <span className={`font-mono ${textSizeClasses[textSize]} text-gray-600`} title={displayValue}>
                        {truncatedValue}
                    </span>
                    <Button.Root
                        bgColor="bg-gray-100"
                        textColor="text-gray-700"
                        hover
                        hoverColor="bg-gray-200"
                        onClick={() => truncatedCopyConfig.onCopy(displayValue)}
                        className="p-1.5 h-7"
                    >
                        <CopyIcon size={12} weight="bold" />
                    </Button.Root>
                </div>
            );

        case 'actions':
            if (!actionsConfig || !item) return null;
            return (
                <div className={`flex items-center gap-2 ${className}`}>
                    {actionsConfig.onEdit && (
                        <Button.Root
                            bgColor="bg-blue-100"
                            textColor="text-blue-700"
                            hover
                            hoverColor="bg-blue-200"
                            onClick={() => actionsConfig.onEdit?.(item)}
                            className="p-1.5 h-8"
                        >
                            <PencilIcon size={14} weight="bold" />
                        </Button.Root>
                    )}
                    {actionsConfig.onDelete && (
                        <Button.Root
                            bgColor="bg-red-100"
                            textColor="text-red-700"
                            hover
                            hoverColor="bg-red-200"
                            onClick={() => actionsConfig.onDelete?.(item)}
                            className="p-1.5 h-8"
                        >
                            <TrashIcon size={14} weight="bold" />
                        </Button.Root>
                    )}
                </div>
            );

        default:
            return (
                <div className={baseClasses}>
                    {children || value}
                </div>
            );
    }
};
