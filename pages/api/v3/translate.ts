// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { cors } from '../../../lib/cors'
import { translationServiceClient as translate, v3Parent as parent } from '../../../lib/translate'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  cors(res);
  // other params
  const targetLanguage = req.query.to as string|undefined;
  const sourceLanguage = req.query.from as string|undefined;
  // get words to be translated
  const data: string[] = Array.isArray(req.body) && req.body.length > 0 && req.body.every(e => typeof e === 'string') ? req.body : [];

  if(data.length === 0 || targetLanguage === undefined || sourceLanguage === undefined) {
    res.status(200).json([]);
  }
  else {
    const results = await translate.translateText({
      parent,
      contents: data,
      mimeType: 'text/html',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
      model: null
    });
  
    res.status(200).json(results[0].translations?.map(e => e.translatedText))
  }
}