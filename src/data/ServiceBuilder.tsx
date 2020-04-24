import Service from "./Service";
import {ServiceType} from "./ServiceType";

export default class ServiceBuilder {

    private _id?: string;
    private _name?: string;
    private _serviceType?: ServiceType;
    private _defaultCapacity?: number;

    public setId(id: string): ServiceBuilder {
        this._id = id;
        return this;
    }

    public id(): string | undefined {
        return this._id;
    }

    public setName(name: string): ServiceBuilder {
        this._name = name;
        return this;
    }

    public name(): string | undefined {
        return this._name;
    }

    public setServiceType(type: string): ServiceBuilder {
        const idx = +type;
        this._serviceType = ServiceType[ServiceType[idx] as keyof typeof ServiceType];
        return this;
    }

    public serviceType(): ServiceType | undefined {
        return this._serviceType;
    }

    public setDefaultCapacity(capacity: string): ServiceBuilder {
        if(capacity === '') {
            this._defaultCapacity = -1
        } else {
            const num = +capacity;
            if(isNaN(num)) {
                this._defaultCapacity = -1
            } else {
                this._defaultCapacity = num;
            }
        }
        return this;
    }

    public defaultCapacity(): number | undefined {
        return this._defaultCapacity
    }

    public setField(field: string, value: string): ServiceBuilder {
        switch(field) {
            case 'id':
                return this.setId(value);
            case 'name':
                return this.setName(value);
            case 'serviceType':
                return this.setServiceType(value);
            case 'defaultCapacity':
                if(value === '' || value === 'NaN') {
                    return this.setDefaultCapacity('-1')
                }
                return this.setDefaultCapacity(value);
            default:
                return this;

        }
    }

    public build(): Service {
        if (this._id === undefined || this._name === undefined) {
            throw new Error('All required service fields must be set')
        } else {
            return new Service(
                this._id,
                this._name,
                this._serviceType || ServiceType.SHELTER,
                (this._defaultCapacity === -1 ? undefined : this._defaultCapacity)
            )
        }
    }

    public static load(service?: Service): ServiceBuilder {
        if(service !== undefined) {
            return new ServiceBuilder()
                .setId(service.id)
                .setName(service.name)
                .setServiceType(service.serviceType.toString())
                .setDefaultCapacity(service.defaultCapacity === undefined ? '' : service.defaultCapacity.toString())
                ;
        } else {
            return ServiceBuilder.emptyBuilder();
        }
    }

    public static emptyBuilder(): ServiceBuilder {
        return new ServiceBuilder()
            .setId('')
            .setName('')
            .setServiceType(ServiceType.SHELTER.toString())
            .setDefaultCapacity('-1')
    }

}