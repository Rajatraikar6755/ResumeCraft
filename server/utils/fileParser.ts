// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse.js';
import * as mammoth from 'mammoth';

export const parseFile = async (file: Express.Multer.File): Promise<string> => {
    if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        return data.text;
    } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/msword'
    ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
    }
    throw new Error('Unsupported file type');
};
