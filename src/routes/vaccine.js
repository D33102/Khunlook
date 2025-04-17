import { vaccineController } from "../controllers/vaccine.js";

export function vaccineRoute(fastify, options, done) {
  fastify.post(
    "/information",
    {
      schema: vaccineController.getVaccinesInfo.schema,
    },
    vaccineController.getVaccinesInfo.handler,
  );

  fastify.post(
    "/hospitals",
    {
      // preValidation: [fastify.authenticate],
      schema: vaccineController.vaccineHospital.schema,
    },
    vaccineController.vaccineHospital.handler,
  );

  fastify.post(
    "/create",
    {
      preValidation: [fastify.authenticate],
      schema: vaccineController.createVaccine.schema,
    },
    vaccineController.createVaccine.handler,
  );

  fastify.put(
    "/",
    {
      preValidation: [fastify.authenticate],
      schema: vaccineController.updateVaccine.schema,
    },
    vaccineController.updateVaccine.handler,
  );

  fastify.delete(
    "/",
    {
      preValidation: [fastify.authenticate],
      schema: vaccineController.deleteVaccine.schema,
    },
    vaccineController.deleteVaccine.handler,
  );

  done();
}
