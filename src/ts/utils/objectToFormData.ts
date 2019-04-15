export type DataObject = {
    [name: string]: string | Blob;
};

/**
 * Simple helper that converts an array of data into form data
 */
export function objectToFormData(dataObject: DataObject): FormData {
    const formData = new FormData();

    for (const dataName of Object.keys(dataObject)) {
        formData.append(dataName, dataObject[dataName]);
    }

    return formData;
}