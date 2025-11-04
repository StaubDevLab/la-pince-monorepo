import { Path } from "nestjs-i18n";
export type I18nTranslations = {
    "common": {
        "welcome": string;
        "USERACCOUNT": {
            "negativeBalance": string;
        };
        "BUDGET": {
            "75": string;
            "reached": string;
            "reset": string;
        };
        "TRANSACTIONS": {
            "CHILDREN": {
                "created": string;
            };
        };
    };
};
export type I18nPath = Path<I18nTranslations>;
