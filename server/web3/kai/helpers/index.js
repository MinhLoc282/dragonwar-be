import APIError from '../../../util/APIError';

export const callHelpers = async (contract, addressContract, method, params = []) => {
    try {
        if (!contract.methods[method]) {
            throw new Error(`Method ${method} not found on the contract`);
        }

        const result = await contract.methods[method](...params).call({
            from: addressContract,
        });

        return result;
    } catch (error) {
        console.log('error callHelpers: ', error);
        throw new APIError(500, 'Internal server error');
    }
};
