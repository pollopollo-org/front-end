
export enum UserTypes {
    PRODUCER = "Producer",
    RECEIVER = "Receiver"
}

/**
 * Specifies what's available in a stored JWT token
 */
export type UserToken = {
    /**
     * Specifies the userId that the token is related to
     */
    nameid: string;

    /**
     * Specifies the email of the user the token is related to.
     */
    email: string;

    /**
     * Specifies the unqiue name of the user currently logged in
     */
    unique_name: string;
}

/**
 * Defines the data required to create a user model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type UserModelData = {
    userId: number;
    email: string;
    firstName: string;
    surName: string;
    country: string;
    city?: string;
    description?: string;
    thumbnail?: string;
    userRole: UserTypes;
};
// tslint:enable completed-docs

/**
 * User model describing all content required on a user
 */
export class UserModel {
    /**
     * The id of the user
     */
    public readonly id: number;

    /**
     * The email adress of the user
     */
    public readonly email: string;

    /**
     * The first name of the user
     */
    public readonly firstName: string;

    /**
     * The surname of the user
     */
    public readonly surName: string;

    /**
     * The country the user lives in
     */
    public readonly country: string;

    /**
     * The city the user lives in
     */
    public readonly city?: string;

    /**
     * The description of the user
     */
    public readonly description?: string;

    /**
     * The path to the user's profile picture
     */
    public readonly thumbnail?: string;

    constructor(data: UserModelData) {
        this.id = data.userId;
        this.email = data.email;
        this.firstName = data.firstName;
        this.surName = data.surName;
        this.country = data.country;
        this.city = data.city;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
    }
}
