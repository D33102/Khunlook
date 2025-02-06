import { nutritionController } from "../controllers/nutrition.js";

export function nutritionRoute(fastify, options, done) {
  fastify.post(
    "/query-plot",
    {
      preValidation: [fastify.authenticate],
      schema: nutritionController.queryNutritionPlot.schema
    },
    nutritionController.queryNutritionPlot.handler
  );
  done();
}
