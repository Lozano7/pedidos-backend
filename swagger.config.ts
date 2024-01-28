// swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('Pedidos API')
    .setDescription('Documentación de la API de Pedidos')
    .setVersion('1.0') // Puedes agregar más tags según tus necesidades
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
