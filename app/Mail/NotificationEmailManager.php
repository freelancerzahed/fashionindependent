<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotificationEmailManager  extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $array;

    public function __construct($array)
    {
        $this->array = $array;
    }
    /**
     * Build the message.
     *
     * @return $this
     */
     public function build()
     {
         return $this->view($this->array['view'])
                     ->from($this->array['from'], env('MAIL_FROM_NAME'))
                     ->subject($this->array['subject'])
                     ->with([
                         'subject' => $this->array['subject'],
                         'user_name'=>$this->array['user_name'],
                         'type'=>$this->array['type']
                     ]);
     }
}
