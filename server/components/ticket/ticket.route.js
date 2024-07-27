import { Router } from 'express';
import * as TicketController from './ticket.controller';
import {isAuthorUser} from "../../api/auth.middleware";
import {USER_ROLE} from "../../constants";

const router = new Router();

router.route('/')
  .get(
    isAuthorUser(),
    TicketController.getTickets
  )
  .post(
    isAuthorUser(USER_ROLE.ADMIN),
    TicketController.createTicket
  )

router.route('/update-price')
  .get(
    TicketController.updatePriceTicket
  )

router.route('/admin')
  .get(
    isAuthorUser(USER_ROLE.ADMIN),
    TicketController.adminGetTickets
  )

export default router;
