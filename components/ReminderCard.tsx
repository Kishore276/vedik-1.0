import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reminder } from '../types/Reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onPress }) => {
  const daysUntil = () => {
    const today = new Date();
    const reminderDate = new Date(reminder.date);
    const diffTime = Math.abs(reminderDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getIconName = () => {
    switch (reminder.type) {
      case 'birthday':
        return 'gift-outline';
      case 'anniversary':
        return 'heart-outline';
      case 'meeting':
        return 'calendar-outline';
      default:
        return 'calendar-outline';
    }
  };

  const getCardColor = () => {
    switch (reminder.type) {
      case 'birthday':
        return ['#4cc9f0', '#4361ee'];
      case 'anniversary':
        return ['#f72585', '#b5179e'];
      case 'meeting':
        return ['#3a5a40', '#52b788'];
      default:
        return ['#5E60CE', '#4CC9F0'];
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
    >
      <View style={[styles.topBar, { backgroundColor: getCardColor()[0] }]} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: getCardColor()[1] }]}>
          <Ionicons name={getIconName()} size={24} color="white" />
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>{reminder.title}</Text>
          <Text style={styles.date}>
            {new Date(reminder.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.daysText}>
          <Text style={styles.daysCount}>{daysUntil()}</Text> days left
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 160,
    height: 160,
    marginLeft: 4,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  topBar: {
    height: 12,
    width: '100%',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5E60CE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
  },
  daysText: {
    fontSize: 13,
    color: '#666',
  },
  daysCount: {
    fontWeight: 'bold',
    color: '#5E60CE',
  },
});

export default ReminderCard;