import { UPLOAD_GET_HOST } from '../config';

export function getImageLink(image) {
    return `${UPLOAD_GET_HOST}/${image}`;
}
