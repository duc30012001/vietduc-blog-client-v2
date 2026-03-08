import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Get a locale-specific value from an object with `vi` and `en` suffixed keys.
 *
 * @example
 * getLocalizedValue(brand, 'shortIntro', 'vi') // returns brand.shortIntroVi
 * getLocalizedValue(category, 'name_', 'en')   // returns category.name_en
 */
export function getLocalizedValue<T extends object>(
    obj: T,
    prefix: string,
    locale: string,
): string {
    // Handle snake_case pattern: name_vi, name_en
    const snakeKey = `${prefix}${locale}` as keyof T;
    if (snakeKey in obj) {
        return String(obj[snakeKey] ?? '');
    }

    // Handle camelCase pattern: shortIntroVi, shortIntroEn
    const camelSuffix = locale === 'vi' ? 'Vi' : 'En';
    const camelKey = `${prefix}${camelSuffix}` as keyof T;
    if (camelKey in obj) {
        return String(obj[camelKey] ?? '');
    }

    return '';
}
