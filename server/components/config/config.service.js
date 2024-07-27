import Config from './config.model';
import logger from '../../api/logger';
import { INITIAL_CONFIG } from './config.initial';
import {ROOT_PATH, SKILL_RESOURCE_CLASS, SKILLS_RESOURCE_PART} from "../../constants";
import APIError from "../../util/APIError";

const fs = require('fs');


export async function generateConfig() {
  try {
    const config = await Config.findOne({});
    if (config) return;
    await Config.create(INITIAL_CONFIG);
  } catch (error) {
    logger.error('Error in generateConfig');
    logger.error(error);
  }
}

export async function skillsExists() {
  try {
    const listSkills = [];
    Object.values(SKILL_RESOURCE_CLASS).forEach((className) => {
      Object.values(SKILLS_RESOURCE_PART).forEach((part) => {
        listSkills.push(`${part}_${className}_1`);
        listSkills.push(`${part}_${className}_1_attacked`);
        listSkills.push(`${part}_${className}_2`);
        listSkills.push(`${part}_${className}_2_attacked`);
      });
    });
    const result = {
      exists: [],
      notExists: []
    };
    listSkills.forEach((skill) => {
      const dir = `${ROOT_PATH}/resource/skills/${skill}`;
      if (fs.existsSync(dir)) {
        result.exists.push(skill);
      } else {
        result.notExists.push(skill);
      }
    });
    return result;
  } catch (error) {
    logger.error('Error in skillsExists');
    logger.error(error);
  }
}


export async function getConfigs() {
  try {
    return await Config.findOne({}).lean();
  } catch (error) {
    logger.error('error getConfigs : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}

export async function editConfigs(data) {
  try {
    await Config.updateOne({}, { $set: data });
    return true;
  } catch (error) {
    logger.error('error editConfigs : ', error);
    return Promise.reject(new APIError(error.statusCode || 500, error.message || error.errors || 'Internal Server Error.'));
  }
}
