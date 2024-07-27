import logger from '../../api/logger';
import APIError from '../../util/APIError';
import Ticket from './ticket.model';
import Team from '../team/team.model';
import {
  AMOUNT_INCREASE_TIMES_VIA_TICKET,
  TEAM_STATUS,
  TICKET_TYPES
} from '../../constants';
import { web3 } from '../../web3/kai';

/**
 * @param options
 * @param {number} options.limit
 * @param {number} options.skip
 * @param {number} options.page
 * @param {string} options.team
 * @param {string} options.txHash
 * @param auth
 * @param {string} auth._id
 * @returns {Promise<void>}
 */
export async function getTickets(options, auth) {
  try {
    const conditions = {
      user: auth._id
    };
    if (options.team) {
      conditions.team = options.team;
    }
    if (options.txHash) {
      conditions.txHash = options.txHash;
    }
    const promise = [
      Ticket.countDocuments(conditions),
      Ticket.find(conditions).sort({ createdAt: -1 }).limit(options.limit).skip(options.skip)
.populate('team')
    ];
    const data = await Promise.all(promise);
    const tickets = data[1].map(ticket => ticket.toJSON());
    return {
      data: tickets,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('TeamService getTickets error:', error);
    throw new APIError(500, 'Internal server error');
  }
}

/**
 *
 * @param options
 * @returns {Promise<{totalItems: (number|module:mongoose), data, totalPages: number, currentPage}>}
 */
export async function adminGetTickets(options) {
  try {
    const conditions = {};
    if (options.user) {
      conditions.user = options.user;
    }
    if (options.team) {
      conditions.team = options.team;
    }
    if (options.txHash) {
      conditions.txHash = options.txHash;
    }
    const promise = [
      Ticket.countDocuments(conditions),
      Ticket
        .find(conditions)
        .sort({ createdAt: -1 })
        .limit(options.limit)
        .skip(options.skip)
        .populate('team')
        .populate('user')
    ];
    const data = await Promise.all(promise);
    const tickets = data[1].map(ticket => ticket.toJSON());
    return {
      data: tickets,
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    };
  } catch (error) {
    logger.error('TicketService adminGetTickets error:', error);
    throw new APIError(500, 'Internal server error');
  }
}


export async function createTicket(data) {
  try {
    const team = await Team.findOne({
      uid: Number(data.teamId),
      status: TEAM_STATUS.ACTIVE
    });
    let dataUpdate = {};
    if (data.type === TICKET_TYPES.PVE_TICKET) {
      dataUpdate = {
        'battleTimes.pve': (team?.battleTimes?.pve || 0) + AMOUNT_INCREASE_TIMES_VIA_TICKET
      };
    }
    if (data.type === TICKET_TYPES.PVP_TICKET) {
      dataUpdate = {
        'battleTimes.pvp': (team?.battleTimes?.pvp || 0) + AMOUNT_INCREASE_TIMES_VIA_TICKET
      };
    }
    if (!team) return;
    await Promise.all([
      Ticket.create({
        user: team.owner,
        team: team._id,
        type: data.type,
        price: data?.price,
        priceNumber: web3.utils.fromWei(data.price, 'ether'),
        count: Number(data?.count),
        time: Number(data?.time),
        txHash: data?.txHash
      }),
      Team.updateOne({
        _id: team._id
      }, {
        $set: dataUpdate
      })
    ]);
  } catch (error) {
    logger.error('TicketService createTicket error:', error);
  }
}

export async function updatePriceTicket() {
  try {
    const tickets = await Ticket.find({});
    const promise = tickets.map(async (item) => {
      const priceNumber = Number(item.price) / 10 ** 18 || 0;
      item.priceNumber = priceNumber;
      await item.save();
    });
    await Promise.all(promise);
  } catch (error) {
    logger.error('TicketService updatePriceTicket error:', error);
    throw new APIError(500, 'Internal server error');
  }
}
