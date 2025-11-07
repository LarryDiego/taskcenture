package com.taskflow.notification.service;

import com.taskflow.notification.model.Notification;
import com.taskflow.project.model.Project;
import com.taskflow.auth.model.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String message, Project project);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadNotifications(Long userId);
    long getUnreadCount(Long userId);
    Notification markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
    void notifyUserAddedToProject(User user, Project project, User addedBy);
    void deleteNotification(Long notificationId);
}
