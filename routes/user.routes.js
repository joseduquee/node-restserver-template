import { Router } from "express";
import { check } from "express-validator";
import {
  usersDelete,
  usersGet,
  usersPath,
  usersPost,
  usersPut,
} from "../controllers/users.controller.js";
import { fieldsValidator, jwtValidator, hasRole, isAdmin} from "../middlewares/index.js";
import { existsEmail, isRoleValid, existsUserById } from '../helpers/db-validators.js'

export const router = Router();

router.get('/', usersGet);

router.post('/',
  [
    check("name", "Name is require").not().isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("email").custom( existsEmail ),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    //    check('role', 'It is not a valid role').isIn(['USER_ROLE', 'ADMIN_ROLE']),
    // check('role').custom( (rol) => isRoleValid(rol)),
    check('role').custom( isRoleValid ),
    fieldsValidator,
  ],
  usersPost
);

router.put('/:id', [
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom(existsUserById),
  check('role').custom( isRoleValid ),
  fieldsValidator
], usersPut);

router.patch('/', usersPath);

router.delete('/:id', [
  jwtValidator,
  // isAdmin,
  hasRole('ADMIN_ROLE', 'SALES_ROLE'),
  check('id', 'It is not a valid id').isMongoId(),
  check('id').custom(existsUserById),
  fieldsValidator
], usersDelete);
