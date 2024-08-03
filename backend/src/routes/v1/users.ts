import { Router } from "express";

import { list, show, edit, destroy } from "controllers/users";
import { checkJwt } from "middleware/checkJwt";
import { checkRole } from "middleware/checkRole";
import { validatorEdit } from "middleware/validation/users";
import { Role } from "orm/entities/users/types";

const router = Router();

router.get("/", [checkJwt, checkRole([Role.ADMINISTRATOR])], list);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole([Role.ADMINISTRATOR], true)],
  show
);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole([Role.ADMINISTRATOR], true), validatorEdit],
  edit
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole([Role.ADMINISTRATOR], true)],
  destroy
);

export default router;
