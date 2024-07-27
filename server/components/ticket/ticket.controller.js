import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT} from "../../constants";
import * as TicketService from "./ticket.service";


export async function getTickets(req, res, next) {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const options = {
      ...req.query,
      page,
      limit,
      skip
    };
    const data = await TicketService.getTickets(options, req.auth);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function adminGetTickets(req, res, next) {
  try {
    let page = Number(req.query.page) || 1;
    if (page < 1 || page > MAX_PAGE_LIMIT) {
      page = MAX_PAGE_LIMIT;
    }
    const limit = Number(req.query.rowPerPage) || DEFAULT_LIMIT_QUERY;
    const skip = (page - 1) * limit;
    const options = {
      ...req.query,
      page,
      limit,
      skip
    };
    const data = await TicketService.adminGetTickets(options);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTicket(req, res, next) {
  try {
    const { body } = req;
    await TicketService.createTicket(body);
    return res.json({
      success: true
    })
  } catch (error) {
    return next(error);
  }
}

export async function updatePriceTicket(req, res, next) {
  try {
    await TicketService.updatePriceTicket();
    return res.json({
      success: true
    })
  } catch (error) {
    return next(error);
  }
}
