'use client';

import { useState, useEffect } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getExpiryAlert, ExpiryAlert } from '../utils/expiry-helper';
import { formatDate } from '@/shared/utils';

export function ExpiryField({ dateStr, type }: { dateStr: string | null | undefined; type: 'rc' | 'insurance' | 'fitness' | 'permit' }) {
  if (!dateStr) return <span className="text-muted-foreground">-</span>;

  const alert = getExpiryAlert(dateStr, type);
  const formattedDate = formatDate(dateStr);

  const getAlertIcon = () => {
    switch (alert.status) {
      case 'expired':
      case 'critical':
        return <ShieldAlert className="h-4 w-4 text-red-500 inline shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500 inline shrink-0" />;
      case 'soon':
        return <AlertTriangle className={`h-4 w-4 inline shrink-0 ${alert.color === 'magenta' ? 'text-fuchsia-500' : 'text-yellow-500'}`} />;
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 inline shrink-0" />;
      default:
        return null;
    }
  };

  const getTooltipMessage = () => {
    switch (alert.status) {
      case 'expired':
        return `This document expired! Please renew it immediately.`;
      case 'critical':
        return `Critical Expiry Warning: Expiring in ${alert.daysRemaining} days. Renew immediately.`;
      case 'warning':
        return `Warning: Expiring in ${alert.daysRemaining} days. Renewal is recommended.`;
      case 'soon':
        return `Notice: Expiring soon in ${alert.daysRemaining} days.`;
      case 'valid':
        return `Document is active and valid for the next ${alert.daysRemaining} days.`;
      default:
        return '';
    }
  };

  const getTextColorClass = () => {
    if (alert.status === 'expired' || alert.status === 'critical') return 'text-red-500 font-semibold';
    if (alert.status === 'warning') return 'text-orange-500 font-medium';
    if (alert.status === 'soon') return alert.color === 'magenta' ? 'text-fuchsia-500 font-medium' : 'text-yellow-500 font-medium';
    return '';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <div className="flex items-center gap-1.5 cursor-help">
              <span className={getTextColorClass()}>{formattedDate}</span>
              {getAlertIcon()}
            </div>
          }
        />
        <TooltipContent className="text-xs bg-slate-900 text-slate-50 border border-slate-800 shadow-md">
          {getTooltipMessage()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function RegNoExpiryAlert({ vehicle }: { vehicle: any }) {
  const alerts = [
    { name: 'RC', alert: getExpiryAlert(vehicle.rc_expiry, 'rc') },
    { name: 'Insurance', alert: getExpiryAlert(vehicle.insurance_expiry, 'insurance') },
    { name: 'Fitness', alert: getExpiryAlert(vehicle.fitness_expiry, 'fitness') },
    { name: 'Permit', alert: getExpiryAlert(vehicle.permit_expiry, 'permit') },
  ];

  const activeAlerts = alerts.filter(
    a => a.alert.status === 'expired' || a.alert.status === 'critical' || a.alert.status === 'warning' || a.alert.status === 'soon'
  );

  const hasActiveAlert = activeAlerts.length > 0;

  if (!hasActiveAlert) return <span>{vehicle.reg_number}</span>;

  let alertColor = 'text-yellow-500';
  if (activeAlerts.some(a => a.alert.status === 'expired' || a.alert.status === 'critical')) {
    alertColor = 'text-red-500';
  } else if (activeAlerts.some(a => a.alert.status === 'warning')) {
    alertColor = 'text-orange-500';
  } else if (activeAlerts.some(a => a.alert.color === 'magenta')) {
    alertColor = 'text-fuchsia-500';
  }

  return (
    <div className="flex items-center gap-2">
      <span>{vehicle.reg_number}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <div className="cursor-help inline-flex items-center">
                <AlertCircle className={`h-4 w-4 ${alertColor} shrink-0`} />
              </div>
            }
          />
          <TooltipContent className="text-xs bg-slate-900 text-slate-50 border border-slate-800 p-2.5 rounded shadow-lg max-w-[280px]">
            <div className="space-y-1.5">
              <p className="font-semibold text-[11px] text-slate-300 border-b border-slate-800 pb-1">Compliance Warnings:</p>
              {activeAlerts.map((a, i) => (
                <div key={i} className="flex justify-between items-center gap-4 text-[10px]">
                  <span className="font-medium text-slate-400">{a.name}</span>
                  <span className={
                    a.alert.status === 'expired' || a.alert.status === 'critical' ? 'text-red-400 font-semibold' :
                    a.alert.status === 'warning' ? 'text-orange-400 font-medium' :
                    a.alert.color === 'magenta' ? 'text-fuchsia-400 font-medium' : 'text-yellow-400 font-medium'
                  }>
                    {a.alert.label}
                  </span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
