import { useState } from 'react';
import { Bell, Send, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const recentNotifications = [
  { id: 1, title: 'System Maintenance', message: 'Scheduled maintenance on Feb 25', audience: 'All Users', sentAt: '2024-02-20 10:00 AM', status: 'sent' },
  { id: 2, title: 'New Feature', message: 'Video consultations now available', audience: 'Pet Owners', sentAt: '2024-02-18 02:30 PM', status: 'sent' },
  { id: 3, title: 'Vet Portal Update', message: 'New prescription management tools', audience: 'Veterinarians', sentAt: '2024-02-15 09:00 AM', status: 'sent' },
];

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');

  const handleSendNotification = () => {
    if (!title || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Notification sent successfully!');
    setTitle('');
    setMessage('');
    setAudience('all');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Send notifications to users</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                placeholder="Notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea
                placeholder="Write your notification message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Target Audience</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="pet_owners">Pet Owners Only</SelectItem>
                  <SelectItem value="veterinarians">Veterinarians Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendNotification} className="w-full gap-2">
              <Send className="h-4 w-4" />
              Send Notification
            </Button>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Quick Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'System Maintenance', message: 'We will be performing scheduled maintenance...' },
                { title: 'New Feature Alert', message: 'We are excited to announce a new feature...' },
                { title: 'Holiday Hours', message: 'Please note our updated hours during...' },
                { title: 'Important Update', message: 'Please update your app to the latest version...' },
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTitle(template.title);
                    setMessage(template.message);
                  }}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-foreground">{template.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{template.message}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{notification.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {notification.audience}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">Sent: {notification.sentAt}</p>
                </div>
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Sent
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
