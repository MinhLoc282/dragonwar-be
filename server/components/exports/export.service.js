import {BATTLE_TYPES, EXPORT_TYPES, ROOT_PATH, TEAM_STATUS} from '../../constants';
import Team from '../team/team.model';
import { getTeamRankingPvE, getTeamRankingPvEV2, getTeamRankingPvP, getTeamRankingPvPV2 } from '../team/team.service';
import Users from '../user/user.model';
import { updatePoolRewardPvE, updatePoolRewardPvP } from '../../../cron/cron/handleEvent';
import Export from './export.model';
import logger from "../../api/logger";
import APIError from "../../util/APIError";
import RankingHistory from "../rankingHistory/rankingHistory.model";
import BattleHistory from '../battleHistory/battleHistory.model';
import { conditionTimeInMonth } from '../../helpers';
import ReportRanking from '../rankingHistory/reportRanking.model';

const fs = require('fs');
const excelJS = require('exceljs');
const XLSX = require('xlsx');


export async function exportRankingRewardPvE() {
  try {
    if (!fs.existsSync('resource/rewards')) {
      fs.mkdirSync('resource/rewards');
    }
    const poolReward = await updatePoolRewardPvE();
    const conditions = {
      status: TEAM_STATUS.ACTIVE
    };
    const sort = {
      'point.pve': -1,
      'battleTime.pve': 1,
    };
    const teams = await Team.find(conditions).sort(sort).lean();
    let i = 0;
    const teamsRanking = [];

    while (i < teams?.length) {
      const ranking = await getTeamRankingPvEV2(teams, teams[i]);
      const owner = await Users.findById(teams[i].owner).lean();
      teamsRanking.push({
        ...teams[i],
        ranking,
        owner
      });
      i += 1;
    }

    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/PVE-Reward.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataRatioReward = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const time = new Date();
    const timeString = `${time.getUTCHours()}_${time.getUTCMinutes()}_${time.getUTCSeconds()}_${time.getUTCDate()}-${time.getUTCMonth() + 1}-${time.getUTCFullYear()}`;
    const workbookCreate = new excelJS.Workbook();
    const worksheet = workbookCreate.addWorksheet('Reward PvE');

    worksheet.columns = [
      { header: 'Rank', key: 'rank', width: 20 },
      { header: 'Team', key: 'team', width: 40 },
      { header: 'Owner address', key: 'ownerAddress', width: 50 },
      { header: 'Point', key: 'point', width: 20 },
      { header: 'Time in battle', key: 'time', width: 20 },
      { header: 'Reward', key: 'reward', width: 20 },
    ];
    const path = `resource/rewards/pve-${timeString}.xlsx`;
    const promiseRankingHistory = [];
    let totalBattleTime = 0;
    teamsRanking.forEach((team, index) => {
      if (index < 1000) {
        worksheet.addRow(
          {
            rank: team?.ranking,
            team: team?.name,
            ownerAddress: team?.owner?.address,
            point: team?.point?.pve,
            time: team?.battleTime?.pve,
            reward: team?.point?.pve && xlDataRatioReward?.[team?.ranking - 1]?.reward ? (poolReward * xlDataRatioReward?.[team?.ranking - 1]?.reward) / 100 : 0,
          }
        );
      }
      totalBattleTime += team?.battleTime?.pve || 0;
      const rankingHistory = {
        rank: team?.ranking,
        team: team._id,
        owner: team?.owner?._id,
        point: team?.point?.pve || 0,
        battleTime: team?.battleTime?.pve || 0,
        reward: team?.point?.pve && xlDataRatioReward?.[team?.ranking - 1]?.reward ? (poolReward * xlDataRatioReward?.[team?.ranking - 1]?.reward) / 100 : 0,
        dragons: team?.dragons?.map(dragon => dragon.id),
        type: BATTLE_TYPES.ADVENTURE
      };
      promiseRankingHistory.push(rankingHistory);
    });
    worksheet.addRow({});
    worksheet.addRow({});
    worksheet.addRow({
      rank: 'Total pool reward',
      team: poolReward
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    await workbookCreate.xlsx.writeFile(path);
    await Export.create({
      file: path,
      type: EXPORT_TYPES.PVE_RANKING_REWARD
    });

    let j = 0;

    while (j < promiseRankingHistory?.length) {
      await RankingHistory.create(promiseRankingHistory[j]);
      j += 1;
    }

    const datePreMonth = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const battleTimes = await BattleHistory.countDocuments({
      type: BATTLE_TYPES.ADVENTURE,
      createdAt: conditionTimeInMonth(datePreMonth.getMonth() + 1, datePreMonth.getFullYear())
    });
    await ReportRanking.create({
      month: datePreMonth.getMonth() + 1,
      year: datePreMonth.getFullYear(),
      reward: poolReward,
      battleTimes,
      battleTime: totalBattleTime,
      team: teams.length,
      type: BATTLE_TYPES.ADVENTURE
    });
    await Team.updateMany(
      {
        status: TEAM_STATUS.ACTIVE
      }, {
        $set: {
          'battleTime.pve': 0,
          'point.pve': 0
        }
      }
    );
    return true;
  } catch (error) {
    console.log('Error in exportRankingRewardPvE');
    console.log(error);
  }
}

export async function exportRankingRewardPvP() {
  try {
    const lastLogged = await ReportRanking.find({ type: BATTLE_TYPES.ARENA }).sort({ _id: -1 }).limit(1);
    const lastTimeLogged = new Date(lastLogged?.[0]?.createdAt || 0).getTime();
    // condition is lastTimeLogged must less current time decrease some day with greater 1 month, pvp will be logged every 2 months
    if (lastTimeLogged > Date.now() - 50 * 24 * 60 * 60 * 1000) return;

    if (!fs.existsSync('resource/rewards')) {
      fs.mkdirSync('resource/rewards');
    }
    const poolReward = await updatePoolRewardPvP();
    const conditions = {
      status: TEAM_STATUS.ACTIVE
    };
    const sort = {
      'point.pvp': -1,
      'battleTime.pvp': 1,
    };
    const teams = await Team.find(conditions).sort(sort).lean();

    let i = 0;
    const teamsRanking = [];

    while (i < teams?.length) {
      const ranking = await getTeamRankingPvPV2(teams, teams[i]);
      const owner = await Users.findById(teams[i].owner).lean();
      teamsRanking.push({
        ...teams[i],
        ranking,
        owner
      });
      i += 1;
    }

    const workbook = XLSX.readFile(`${ROOT_PATH}/resource/PVP-Reward.xlsx`);
    const sheet_name_list = workbook.SheetNames;
    const xlDataRatioReward = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const time = new Date();
    const timeString = `${time.getUTCHours()}_${time.getUTCMinutes()}_${time.getUTCSeconds()}_${time.getUTCDate()}-${time.getUTCMonth() + 1}-${time.getUTCFullYear()}`;
    const workbookCreate = new excelJS.Workbook();
    const worksheet = workbookCreate.addWorksheet('Reward PvP');

    worksheet.columns = [
      { header: 'Rank', key: 'rank', width: 20 },
      { header: 'Team', key: 'team', width: 40 },
      { header: 'Owner address', key: 'ownerAddress', width: 50 },
      { header: 'Point', key: 'point', width: 20 },
      { header: 'Time in battle', key: 'time', width: 20 },
      { header: 'Reward', key: 'reward', width: 20 },
    ];
    const path = `resource/rewards/pvp-${timeString}.xlsx`;
    const promiseRankingHistory = [];
    let totalBattleTime = 0;
    teamsRanking.forEach((team, index) => {
      if (index < 1000) {
        worksheet.addRow(
          {
            rank: team?.ranking,
            team: team?.name,
            ownerAddress: team?.owner?.address,
            point: team?.point?.pvp,
            time: team?.battleTime?.pvp,
            reward: team?.point?.pvp && xlDataRatioReward?.[team?.ranking - 1]?.reward ? (poolReward * xlDataRatioReward?.[team?.ranking - 1]?.reward) / 100 : 0,
          }
        );
      }
      totalBattleTime += team?.battleTime?.pvp || 0;
      const rankingHistory = {
        rank: team?.ranking,
        team: team._id,
        owner: team?.owner?._id,
        point: team?.point?.pvp || 0,
        battleTime: team?.battleTime?.pvp || 0,
        reward: team?.point?.pvp && xlDataRatioReward?.[team?.ranking - 1]?.reward ? (poolReward * xlDataRatioReward?.[team?.ranking - 1]?.reward) / 100 : 0,
        dragons: team?.dragons?.map(dragon => dragon.id),
        type: BATTLE_TYPES.ARENA
      };
      promiseRankingHistory.push(rankingHistory);
    });
    worksheet.addRow({});
    worksheet.addRow({});
    worksheet.addRow({
      rank: 'Total pool reward',
      team: poolReward
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    await workbookCreate.xlsx.writeFile(path);
    await Export.create({
      file: path,
      type: EXPORT_TYPES.PVP_RANKING_REWARD
    });

    let j = 0;

    while (j < promiseRankingHistory?.length) {
      await RankingHistory.create(promiseRankingHistory[j]);
      j += 1;
    }

    const datePreMonth = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const battleTimes = await BattleHistory.countDocuments({
      type: BATTLE_TYPES.ARENA,
      createdAt: conditionTimeInMonth(datePreMonth.getMonth() + 1, datePreMonth.getFullYear())
    });
    await ReportRanking.create({
      month: datePreMonth.getMonth() + 1,
      year: datePreMonth.getFullYear(),
      reward: poolReward,
      battleTimes,
      battleTime: totalBattleTime,
      team: teams.length,
      type: BATTLE_TYPES.ARENA
    });
    await Team.updateMany(
      {
        status: TEAM_STATUS.ACTIVE
      }, {
        $set: {
          'battleTime.pvp': 0,
          'point.pvp': 0
        }
      }
    );
    return true;
  } catch (error) {
    console.log('Error in exportRankingRewardPvP');
    console.log(error);
  }
}

export async function getExports(options) {
  try {
    const conditions = {};
    if (options.type) {
      conditions.type = options.type;
    }
    const promise = [
      Export.countDocuments(conditions),
      Export.find(conditions).limit(options.limit).skip(options.skip)
    ];
    const data = await Promise.all(promise);
    return {
      data: data[1].map(item => item.toJSON()),
      totalItems: data[0],
      currentPage: options.page,
      totalPages: Math.ceil(data[0] / options.limit)
    }
  } catch (error) {
    logger.error('error getExports : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
