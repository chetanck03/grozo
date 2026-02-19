import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { GroceryItem } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#22c55e',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async checkLowStockItems(items: GroceryItem[]): Promise<void> {
    const lowStockItems = items.filter(item => {
      if (!item.lowStockThreshold || item.isCompleted) return false;
      return item.quantity <= item.lowStockThreshold;
    });

    if (lowStockItems.length > 0) {
      const itemNames = lowStockItems.map(item => item.name).join(', ');
      
      await this.scheduleLocalNotification(
        'Low Stock Alert! 📦',
        `Running low on: ${itemNames}`,
        { type: 'low_stock', items: lowStockItems }
        // No trigger = immediate notification
      );
    }
  }

  static async scheduleDailyReminder(): Promise<void> {
    // Cancel existing daily reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily reminder at 9 AM
    await this.scheduleLocalNotification(
      'Grozo Reminder 🛒',
      "Don't forget to check your grocery list before shopping!",
      { type: 'daily_reminder' }
      // Note: Daily repeating notifications require a different approach in production
      // This is a simplified version for demo purposes
    );
  }

  static async scheduleShoppingReminder(items: GroceryItem[]): Promise<void> {
    const pendingItems = items.filter(item => !item.isCompleted);
    
    if (pendingItems.length > 0) {
      await this.scheduleLocalNotification(
        'Shopping Reminder 🛍️',
        `You have ${pendingItems.length} items on your grocery list`,
        { type: 'shopping_reminder', count: pendingItems.length }
        // No trigger = immediate notification
      );
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  static async getMealPlanningReminder(): Promise<void> {
    await this.scheduleLocalNotification(
      'Meal Planning Time! 🍽️',
      'Plan your meals for the week and generate your grocery list',
      { type: 'meal_planning' }
      // Note: Weekly repeating notifications require a different approach in production
      // This is a simplified version for demo purposes
    );
  }

  // Listen for notification responses
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Listen for notifications received while app is in foreground
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }
}