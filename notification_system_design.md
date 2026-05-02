## Notification System Design
To design a notification system, The system needs to create notifications, store them, deliver them to users, and prioritize them so that the most important ones are seen first.

One simple way to structure this is using classes. A base Notification class can hold common things like id, type, message, timestamp, and whether it’s read or not. Then different types like placement, result, and event notifications can extend it. That way, all notifications follow the same structure, but still behave a bit differently when needed.

For example, placement notifications can be treated as more important compared to events. So each type can define its own priority. This helps later when deciding what to show first.

Instead of creating objects directly everywhere, a factory-like approach can be used. Based on the type, the system can decide which kind of notification to create. This keeps things cleaner and avoids too many condition checks scattered around.

Then comes the main logic layer, which can be handled by something like a service. This part manages everything — adding notifications, fetching them, marking them as read, and so on. It also handles sorting.

Sorting is actually important here. The idea is to show higher priority notifications first. If two notifications have the same priority, then the more recent one should come first. That way the user always sees what matters most right now.

For the API side, basic endpoints are enough:

one to create notifications
one to fetch all
one to mark as read
and one to get unread notifications in sorted order


class Notification {
    constructor(id, type, message, timestamp) {
        this.id = id;
        this.type = type;
        this.message = message;
        this.timestamp = timestamp;
        this.read = false;
    }

    getPriority() {
        return 0;
    }
}

class PlacementNotification extends Notification {
    getPriority() {
        return 3;
    }
}

class ResultNotification extends Notification {
    getPriority() {
        return 2;
    }
}

class EventNotification extends Notification {
    getPriority() {
        return 1;
    }
}

class NotificationFactory {
    static create(id, type, message, timestamp) {
        if (type === "placement") return new PlacementNotification(id, type, message, timestamp);
        if (type === "result") return new ResultNotification(id, type, message, timestamp);
        if (type === "event") return new EventNotification(id, type, message, timestamp);
        return new Notification(id, type, message, timestamp);
    }
}

class NotificationService {
    constructor() {
        this.notifications = [];
    }

    add(type, message) {
        const id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const notification = NotificationFactory.create(id, type, message, timestamp);
        this.notifications.push(notification);
        return notification;
    }

    getAll() {
        return this.notifications;
    }

    markAsRead(id) {
        const n = this.notifications.find(x => x.id === id);
        if (n) n.read = true;
    }

    getUnreadSorted(limit = 10) {
        return this.notifications
            .filter(n => !n.read)
            .sort((a, b) => {
                if (b.getPriority() !== a.getPriority()) {
                    return b.getPriority() - a.getPriority();
                }
                return new Date(b.timestamp) - new Date(a.timestamp);
            })
            .slice(0, limit);
    }
}

module.exports = NotificationService;
